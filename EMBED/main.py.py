from machine import ADC, Pin
from utime import sleep
import network
import urequests as requests


# Configuration
WIFI_SSID = "OnePlus Nord CE 2 Lite 5G"
WIFI_PASS = "1122334400"
BASE_URL = "https://happyplants-lyart.vercel.app"
DEBUG = True

# Relay and Moisture Sensor Pin Configuration
RELAY_PIN = 28
MOISTURE_SENSOR_PIN = 26

# Moisture Calibration Values
DRY_VALUE = 60000  # Dry sensor value
WET_VALUE = 2000   # Wet sensor value
THRESHOLD_PERCENT = 20  # Irrigation threshold

# Initialize Components
relay = Pin(RELAY_PIN, Pin.OUT)
moisture_sensor = ADC(Pin(MOISTURE_SENSOR_PIN))


def debug_log(message):
    """Log debug messages if DEBUG is enabled."""
    if DEBUG:
        print(message)


def connect_wifi():
    """Connect to Wi-Fi."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    debug_log("Connecting to Wi-Fi...")
    wlan.connect(WIFI_SSID, WIFI_PASS)
    
    while not wlan.isconnected():
        print(".", end="")
        sleep(0.5)
    
    print("\nWi-Fi connected!")
    debug_log(f"Network Config: {wlan.ifconfig()}")
    return wlan


def read_moisture():
    """Read the moisture level from the sensor and convert it to percentage."""
    raw_value = moisture_sensor.read_u16()
    if raw_value > DRY_VALUE:
        raw_value = DRY_VALUE
    elif raw_value < WET_VALUE:
        raw_value = WET_VALUE

    # Convert raw value to percentage
    moisture_percent = 100 - ((raw_value - WET_VALUE) / (DRY_VALUE - WET_VALUE) * 100)
    return moisture_percent


def start_pump():
    """Start the pump for irrigation."""
    debug_log("Starting pump...")
    relay.on()
    sleep(10)  # Pump runs for 10 seconds
    relay.off()
    debug_log("Pump stopped.")


def send_data(moisture_before, moisture_after, is_irrigated):
    """Send data to the API."""
    try:
        query_params = f"?moistureBefore={moisture_before}&moistureAfter={moisture_after}&isIrrigated={is_irrigated}"
        request_url = f"{BASE_URL}/api/moisture{query_params}"
        debug_log(f"Sending data to: {request_url}")
        
        response = requests.get(request_url)
        debug_log(f"Response Status Code: {response.status_code}")
        debug_log(f"Response Content: {response.content}")
    except Exception as e:
        debug_log(f"Error sending data: {e}")


def monitor_moisture():
    """Monitor the moisture levels and control the pump based on threshold."""
    connect_wifi()

    while True:
        # Measure moisture before irrigation
        moisture_before = read_moisture()
        debug_log(f"Moisture Level Before Irrigation: {moisture_before:.2f}%")
        
        # If moisture is below threshold, start irrigation
        if moisture_before < THRESHOLD_PERCENT:
            start_pump()

            # Measure moisture after irrigation
            moisture_after = read_moisture()
            debug_log(f"Moisture Level After Irrigation: {moisture_after:.2f}%")

            # Send data to the API
            send_data(moisture_before, moisture_after, is_irrigated=1)
        else:
            # No irrigation needed, send only the before value
            send_data(moisture_before, moisture_after=None, is_irrigated=0)

        # Delay before the next cycle
        sleep(30)  # Check every 30 seconds


# Run the main function
if __name__ == "__main__":
    monitor_moisture()
