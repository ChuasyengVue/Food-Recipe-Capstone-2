import React from "react";
import { render } from "@testing-library/react";
import SignupForm from "./SignupForm"
import { MemoryRouter } from "react-router-dom";

const trialSignup = jest.fn();

it("renders without crashing", function () {
    render(<SignupForm />);
});

it("matches snapshot", function() {
    const { asFragment } = render(
        <MemoryRouter>
            <SignupForm signup={trialSignup}/>
        </MemoryRouter>
        
    );
    expect(asFragment()).toMatchSnapshot();
});