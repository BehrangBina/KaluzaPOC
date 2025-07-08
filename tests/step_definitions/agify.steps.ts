import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

Given(`I have the name {string}`, (arg0: string) => {
    // [Given] Sets up the initial state of the system.
});

When(`I send a GET request to the Agify API`, () => {
    // [When] Describes the action or event that triggers the scenario.
});

Then(`the response status should be {int}`, (arg0: number) => {
    // [Then] Describes the expected outcome or result of the scenario.
});

Then(`the response should contain a name`, () => {
    // [Then] Describes the expected outcome or result of the scenario.
});

Then(`the response should contain an age`, () => {
    // [Then] Describes the expected outcome or result of the scenario.
});

Then(`the age should be null or a number`, () => {
    // [Then] Describes the expected outcome or result of the scenario.
});

Given(`I have no name`, () => {
    // [Given] Sets up the initial state of the system.
});