from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import openpyxl

filepath = "/Users/ctsai22/Documents/GitHub/menuify/backend/scraping_result.xlsx"
wb = openpyxl.Workbook()
default_sheet = wb.active


# Set the path to the Chromedriver
DRIVER_PATH = '/Users/ctsai22/Documents/GitHub/menuify/backend/chromedriver-mac-arm64/chromedriver'

# Initialize the Chrome driver
# driver = webdriver.Chrome(executable_path=DRIVER_PATH)
service = Service(executable_path=DRIVER_PATH)
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options)


dininghall_id = ['64','18','24','15','11','05','01','37','27','21','32']

# Navigate to the URL
driver.get(f'https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/{dininghall_id[2]}')
# select = Select(driver.find_element(By.ID, 'mySelect'))
# select.select_by_visible_text('Dinner')

parent_element = driver.find_element(By.ID, 'menuContainer')

divs = parent_element.find_elements(By.TAG_NAME, 'div')

category = []
inline_item = []

for index, div in enumerate(divs, start=1):
    print(div)
    text = div.text.strip()
    if len(text) != 0:
        if "Nutritional & Allergen Icons" in text:
            break

        items = text.split("Nutrient Analysis")
        category.append(items[0])
        inline_item.append(items[1])


for i, (a,b) in enumerate(zip(category,inline_item), start=2):
    default_sheet[f'E{i}'] = a
    default_sheet[f'F{i}'] = b


# driver.get('https://hdh-web.ucsd.edu/dining/apps/diningservices/Restaurants/MenuItem/24')
# print(driver.find_element(By.ID, 'menuContainer').text)

driver.quit()

wb.save(filepath)



