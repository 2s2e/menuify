from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import openpyxl
from selenium.common.exceptions import StaleElementReferenceException
from selenium.common.exceptions import WebDriverException
import time

filepath = "/Users/ctsai22/Documents/GitHub/menuify/backend/scraping_result.xlsx"
wb = openpyxl.Workbook()
default_sheet = wb.active


# Set the path to the Chromedriver
DRIVER_PATH = '/Users/ctsai22/Documents/GitHub/menuify/backend/chromedriver-mac-arm64/chromedriver'

# Initialize the Chrome driver
# driver = webdriver.Chrome(executable_path=DRIVER_PATH)
service = Service(executable_path=DRIVER_PATH)
options = webdriver.ChromeOptions()
# driver = webdriver.Chrome(service=service, options=options)

max_retries = 5  # Number of retry attempts
retry_delay = 10  # Time in seconds between retries
retry_count = 0

while retry_count < max_retries:
    try:
        # Initialize your WebDriver (for example, ChromeDriver)
        driver = webdriver.Chrome(service=service, options=options)
        
        # Perform your Selenium tasks here
        driver.get('https://example.com')
        
        # If successful, break out of the retry loop
        print("Successfully connected!")
        break

    except WebDriverException as e:
        print(f"WebDriverException: {e}")
        retry_count += 1
        if retry_count < max_retries:
            print(f"Retrying... ({retry_count}/{max_retries})")
            time.sleep(retry_delay)  # Wait before retrying
        else:
            print(f"Max retries reached. Unable to connect after {max_retries} attempts.")

dininghall_id = ['64','18','24','15','11','05','01','37','27','21','32']

# Navigate to the URL
# driver.get(f'https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/{dininghall_id[2]}')
driver.get("https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/24")
select = Select(driver.find_element(By.ID, 'mySelect'))
select.select_by_visible_text('Lunch')

parent_element = driver.find_element(By.ID, 'menuContainer')
divs = parent_element.find_elements(By.TAG_NAME, 'div')
print(len(divs))
category = []
inline_item = []

print(driver.find_element(By.XPATH,'//*[@id="menuContainer"]/div[2]').text)


for index, div in enumerate(divs, start=1):
    retry_count = 0
    while retry_count < 3:  # Try up to 3 times
        try:
            print(div.text)
            break  # Exit the loop if successful
        except StaleElementReferenceException:
            retry_count += 1
            div = driver.find_element(By.XPATH, f'//*[@id="menuContainer"]/div[{index}]')

    text = div.text.strip()
    # print("at ", index)
    # print("text: ", text)
    if len(text) != 0:
        if "Nutritional & Allergen Icons" in text:
            break
        
        items = text.split("Nutrient Analysis")
        category.append(items[0])
        print("== ", items[0])
        inline_item.append(items[1])
        print(items[1])


for i, (a,b) in enumerate(zip(category,inline_item), start=2):
    default_sheet[f'C{i}'] = a
    default_sheet[f'D{i}'] = b


# driver.get('https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/24')
# print(driver.find_element(By.ID, 'menuContainer').text)

driver.quit()

wb.save(filepath)



