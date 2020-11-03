Feature: Cucumber Parallel background test

  Background: Test that background doesn't trigger a task creation.
    Given Fred has multiple features written in cucumber
    When he runs the features in parallel with "--parallel features" using cucumber-parallel module

  @happy
  Scenario: (background) Fred runs features in parallel
    Then all the features should run in parallel