Feature: Cucumber Parallel Failing

  In order to have the quick regression with Cucumber
  Fred, a cucumber user
  Wants to run Cucumber Features in Parallel using cucumber-parallel module

  @failed
  Scenario: Joe runs features in parallel
    Given Fred has multiple features written in cucumber
    When he runs the features in parallel with "--parallel features" using cucumber-parallel module
    Then all the features should fail
