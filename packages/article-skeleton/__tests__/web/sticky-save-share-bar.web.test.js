import React from "react";
import { AppRegistry } from "react-native-web";
import { mount } from "enzyme";
import {
  addSerializers,
  compose,
  enzymeTreeSerializer,
  minimaliseTransform,
  minimalWebTransform,
  print,
  rnwTransform
} from "@times-components/jest-serializer";

import "../mocks.web";

import StickySaveAndShareBar from "../../src/sticky-save-and-share-bar";

window.matchMedia = jest.fn(() => ({ matches: true }));

jest.mock("@times-components/save-and-share-bar", () => () =>
  "SaveAndShareBar"
);

addSerializers(
  expect,
  enzymeTreeSerializer(),
  compose(
    print,
    minimalWebTransform,
    minimaliseTransform(),
    rnwTransform(AppRegistry)
  )
);

describe("StickySaveAndShareBar", () => {
  it("renders", () => {
    const component = mount(<StickySaveAndShareBar />);

    expect(component).toMatchSnapshot();
  });
});
