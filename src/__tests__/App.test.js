import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // wait for first render of list (otherwise we get a React state warning)
  await screen.findByText(/lorem testum 1/g);

  // click form page
  fireEvent.click(screen.queryByText("New Question"));

  // fill out form
  fireEvent.change(screen.queryByLabelText(/Prompt/), {
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 1/), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2/), {
    target: { value: "Test Answer 2" },
  });
  fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
    target: { value: "1" },
  });

  // submit form
  fireEvent.submit(screen.queryByText(/Add Question/));

  // view questions
  fireEvent.click(screen.queryByText(/View Questions/));

  expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  await waitFor(() => expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument());

  await screen.findByText(/lorem testum 2/g);
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  const dropdown = screen.queryAllByLabelText(/Correct Answer/)[0];

  // Change the dropdown value
  fireEvent.change(dropdown, { target: { value: "3" } });

  // Wait for the dropdown to update
  await waitFor(() => expect(dropdown.value).toBe("3"));

  // Re-render to confirm the state is updated
  // (In most cases, rerendering is not needed if the component is properly updated)
  // await rerender(<App />);

  // Confirm the updated value
  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});