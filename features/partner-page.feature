@partner
Feature: Partner overview pages
  Each partner's overview page on NBS Source shows the details held in test-data/partners.json.
  Optional details (tagline, phone, website, contact button, social links) are only checked
  when they are present in the test data.

  Scenario Outline: Partner overview: <company>
    Given I open the partner overview page for "<company>"
    Then the page shows the name
    And the page shows the tagline
    And the page shows the phone number
    And the page shows the website link
    And the page shows the contact button
    And the page shows the social media links

    Examples:
      | company                                            |
      | British Board of Agrément (BBA)                    |
      | Code for Construction Product Information (CCPi)   |
      | Energy Technology List (ETL)                       |
