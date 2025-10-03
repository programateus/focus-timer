import { describe, expect, it } from "vitest";
import { HiHome } from "react-icons/hi2";

import { Icon } from "./icon";
import { render } from "@testing-library/react";

describe("Icon", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<Icon Icon={HiHome} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
