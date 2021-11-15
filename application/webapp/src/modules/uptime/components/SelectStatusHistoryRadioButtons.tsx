import {
  chakra,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import { sevenDaysAgo, thirtyDaysAgo, yesterday } from "../utils";

interface SelectStatusHistoryRadioButtonsProps {
  setValue: Function;
  value: number;
  productId: string;
}

export function SelectStatusHistoryRadioButtons(
  props: SelectStatusHistoryRadioButtonsProps
) {
  const { setValue, value, productId } = props;
  return (
    <Flex flexDir="column" mb="10px">
      <chakra.h2 fontSize="md">View data from the last:</chakra.h2>
      <RadioGroup
        onChange={setValue as any}
        value={value}
        defaultValue={yesterday}
      >
        <Stack direction="row" fontWeight="semibold">
          <Radio value={yesterday} _hover={{ cursor: "pointer" }}>
            24 hours
          </Radio>
          <Radio value={sevenDaysAgo} _hover={{ cursor: "pointer" }}>
            7 days
          </Radio>
          <Radio
            value={thirtyDaysAgo}
            isDisabled={productId === PLAN_PRODUCT_IDS.FREE}
            _hover={{ cursor: "pointer" }}
          >
            {productId === PLAN_PRODUCT_IDS.FREE ? (
              <Tooltip label="Upgrade to a paid plan to view older monitor statuses.">
                30 days
              </Tooltip>
            ) : (
              "30 days"
            )}
          </Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
}
