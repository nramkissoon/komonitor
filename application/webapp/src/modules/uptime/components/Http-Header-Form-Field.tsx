import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import {
  Control,
  Controller,
  FieldArrayMethodProps,
  FieldArrayWithId,
  FieldError,
} from "react-hook-form";
import { Inputs } from "./Create-Update-Form-Rewrite";

interface HttpHeaderFormFieldProps {
  fields: FieldArrayWithId<Inputs, "http_headers", "id">[];
  append: (
    value:
      | Partial<{
          header: string;
          value: string;
        }>
      | Partial<{
          header: string;
          value: string;
        }>[],
    options?: FieldArrayMethodProps | undefined
  ) => void;
  remove: (index?: number | number[] | undefined) => void;
  control: Control<Inputs, object>;
  productId: string;
  errors: {
    http_headers?:
      | {
          header?: FieldError | undefined;
          value?: FieldError | undefined;
        }[]
      | undefined;
  };
  touchedFields: {
    http_headers?:
      | {
          header?: true | undefined;
          value?: true | undefined;
        }[]
      | undefined;
  };
}

function NewHeaderButton(
  props: Pick<HttpHeaderFormFieldProps, "append"> & { disabled: boolean }
) {
  const { append, disabled } = props;

  return (
    <Button
      colorScheme="gray"
      color="white"
      bg="gray.400"
      fontWeight="medium"
      _hover={{ bg: "blue.600" }}
      isDisabled={disabled}
      onClick={() => {
        append({});
      }}
    >
      Add New Header
    </Button>
  );
}

export function HttpHeaderFormField(props: HttpHeaderFormFieldProps) {
  const { fields, append, remove, control, productId, errors, touchedFields } =
    props;

  return (
    <>
      <FormControl
      //isDisabled={productId === PLAN_PRODUCT_IDS.FREE}
      >
        <FormLabel htmlFor="http_headers">
          HTTP Headers{" "}
          <chakra.span color={fields.length === 10 ? "red.500" : "inherit"}>
            ({`${fields.length}/10`})
          </chakra.span>
        </FormLabel>
        {fields.map((item, index) => {
          return (
            <Box key={item.id} mb="1em">
              <Flex flexDir={["column", "row"]}>
                <Controller
                  control={control}
                  defaultValue={"Name"}
                  name={`http_headers.${index}.header`}
                  rules={{
                    maxLength: {
                      value: 100,
                      message:
                        "HTTP Header must be 100 characters or less in length.",
                    },
                  }}
                  render={({ field }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={
                        errors.http_headers &&
                        errors.http_headers.length - 1 >= index &&
                        errors.http_headers[index].header !== undefined
                      }
                    >
                      <FormLabel htmlFor="http_headers">Header Name</FormLabel>
                      <Input {...field} />
                      <FormErrorMessage>
                        {errors.http_headers
                          ? errors.http_headers[index].header?.message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name={`http_headers.${index}.value`}
                  defaultValue={"Value"}
                  rules={{
                    maxLength: {
                      value: 200,
                      message:
                        "HTTP Header value must be 200 characters or less in length.",
                    },
                  }}
                  render={({ field }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={
                        errors.http_headers &&
                        errors.http_headers.length - 1 >= index &&
                        errors.http_headers[index].value !== undefined
                      }
                    >
                      <FormLabel htmlFor="http_headers">Header Value</FormLabel>
                      <Input {...field} />
                      <FormErrorMessage>
                        {errors.http_headers
                          ? errors.http_headers[index].value?.message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Button
                  colorScheme="gray"
                  color="white"
                  bg="gray.400"
                  fontWeight="medium"
                  minW="75px"
                  _hover={{ bg: "red.600" }}
                  onClick={() => remove(index)}
                  mt={["10px", "32px"]}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          );
        })}
        <NewHeaderButton append={append} disabled={fields.length === 10} />
      </FormControl>
    </>
  );
}
