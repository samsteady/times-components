import React from "react";
import TestRenderer from "react-test-renderer";
import { iterator } from "@times-components/test-utils";
import { setDimension } from "@times-components/test-utils/dimensions";
import {
  mockDailyRegisterSlice,
  mockLeadOneAndOneSlice,
  mockLeadOneFullWidthSlice,
  mockLeadTwoNoPicAndTwoSlice,
  mockSecondaryOneSlice,
  mockSecondaryFourSlice,
  mockLeadOneAndFourSlice,
  mockSecondaryTwoNoPicAndTwoSlice,
  mockSecondaryOneAndColumnistSlice,
  mockSecondaryTwoAndTwoSlice
} from "@times-components/fixture-generator";
import Responsive from "@times-components/responsive";
import "./mocks";
import {
  DailyRegisterLeadFourSlice,
  LeadOneAndOneSlice,
  LeadOneFullWidthSlice,
  LeadTwoNoPicAndTwoSlice,
  SecondaryOneSlice,
  SecondaryFourSlice,
  LeadOneAndFourSlice,
  SecondaryTwoNoPicAndTwoSlice,
  SecondaryOneAndColumnistSlice,
  SecondaryTwoAndTwoSlice
} from "../src/slices";

const slices = [
  {
    mock: mockDailyRegisterSlice(),
    name: "daily universal register tablet slice",
    Slice: DailyRegisterLeadFourSlice
  },
  {
    mock: mockLeadOneAndOneSlice(),
    name: "lead one and one tablet slice",
    Slice: LeadOneAndOneSlice
  },
  {
    mock: mockLeadOneFullWidthSlice(),
    name: "lead one full width tablet slice",
    Slice: LeadOneFullWidthSlice
  },
  {
    mock: mockLeadTwoNoPicAndTwoSlice(),
    name: "lead two no pic and two tablet slice",
    Slice: LeadTwoNoPicAndTwoSlice
  },
  {
    mock: mockSecondaryOneSlice(),
    name: "secondary one tablet slice",
    Slice: SecondaryOneSlice
  },
  {
    mock: mockSecondaryFourSlice(),
    name: "secondary four tablet slice",
    Slice: SecondaryFourSlice
  },
  {
    mock: mockSecondaryOneAndColumnistSlice(),
    name: "secondary one and columnist",
    Slice: SecondaryOneAndColumnistSlice
  },
  {
    mock: mockSecondaryTwoAndTwoSlice(),
    name: "secondary two and two slice",
    Slice: SecondaryTwoAndTwoSlice
  },
  {
    mock: mockLeadOneAndFourSlice(),
    name: "lead one and four slice",
    Slice: LeadOneAndFourSlice
  },
  {
    mock: mockSecondaryTwoNoPicAndTwoSlice(),
    name: "secondary two no pic and two slice",
    Slice: SecondaryTwoNoPicAndTwoSlice
  }
];

export default () => {
  const tests = slices.map(({ mock, name, Slice }) => ({
    name,
    test: () => {
      setDimension(1000);
      const output = TestRenderer.create(
        <Responsive>
          <Slice onPress={() => {}} slice={mock} />
        </Responsive>
      );

      expect(output).toMatchSnapshot();
    }
  }));

  iterator(tests);
};