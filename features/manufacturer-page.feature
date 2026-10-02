@manufacturer
Feature: Manufacturer overview pages
  Each manufacturer's overview page on NBS Source shows the details held in test-data/manufacturers.json.
  Optional details (tagline, phone, website, contact button, social links) are only checked
  when they are present in the test data.

  Scenario Outline: Manufacturer overview: <company>
    Given I open the manufacturer overview page for "<company>"
    Then the page shows the name
    And the page shows the tagline
    And the page shows the phone number
    And the page shows the website link
    And the page shows the contact button
    And the page shows the social media links

    Examples:
      | company                                    |
      | A Proctor Group Ltd                        |
      | A&S Landscape - Exceptional Covered Spaces |
