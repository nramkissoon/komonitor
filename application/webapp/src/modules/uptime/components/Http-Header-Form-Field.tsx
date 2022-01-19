import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
} from "@chakra-ui/react";
import {
  Control,
  Controller,
  FieldArrayMethodProps,
  FieldArrayWithId,
  FieldError,
  UseFormSetValue,
} from "react-hook-form";
import { Inputs } from "./Create-Update-Form-Rewrite";

interface HttpHeaderFormFieldProps {
  fields: FieldArrayWithId<Inputs, "http_parameters.headers", "id">[];
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
  setValue: UseFormSetValue<Inputs>;
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
  const {
    fields,
    append,
    remove,
    control,
    productId,
    errors,
    touchedFields,
    setValue,
  } = props;
  console.log(fields);
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
                  defaultValue=""
                  control={control}
                  name={`http_parameters.headers.${index}.header`}
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
                      <Input
                        key={item.id}
                        {...field}
                        placeholder="Custom Header Name"
                      />
                      <FormErrorMessage>
                        {errors.http_headers
                          ? errors.http_headers[index].header?.message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  defaultValue=""
                  control={control}
                  name={`http_parameters.headers.${index}.value`}
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
                      <Input key={item.id} {...field} placeholder="Value" />
                      <FormErrorMessage>
                        {errors.http_headers
                          ? errors.http_headers[index].value?.message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <IconButton
                  aria-label="delete header"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  color="white"
                  bg="red.500"
                  fontWeight="medium"
                  _hover={{ bg: "red.600" }}
                  onClick={() => remove(index)}
                >
                  Delete
                </IconButton>
              </Flex>
            </Box>
          );
        })}
        <NewHeaderButton append={append} disabled={fields.length === 10} />
      </FormControl>
    </>
  );
}
