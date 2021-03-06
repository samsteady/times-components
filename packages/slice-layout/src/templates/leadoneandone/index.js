import React from "react";
import { View } from "react-native";
import { editionBreakpoints } from "@times-components/styleguide";
import PropTypes from "prop-types";
import HorizontalLayout from "../horizontallayout";
import styleFactory from "./styles";

const leadOneAndOneSlice = ({ breakpoint, lead, support }) => {
  const styles = styleFactory(breakpoint);

  if (breakpoint === editionBreakpoints.small) {
    return (
      <View>
        {lead}
        <View style={styles.keyline} />
        {support}
      </View>
    );
  }

  return (
    <HorizontalLayout
      containerStyle={styles.container}
      tiles={[
        { style: styles.leadItem, tile: lead },
        { style: styles.supportItem, tile: support }
      ]}
      colSeparatorStyle={styles.colSeparatorStyle}
    />
  );
};

leadOneAndOneSlice.propTypes = {
  breakpoint: PropTypes.string,
  lead: PropTypes.node.isRequired,
  support: PropTypes.node.isRequired
};

leadOneAndOneSlice.defaultProps = {
  breakpoint: editionBreakpoints.small
};

export default leadOneAndOneSlice;
