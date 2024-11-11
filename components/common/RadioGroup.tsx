import {
  RadioGroup as NextUIRadioGroup,
  RadioGroupProps,
} from "@nextui-org/react";

const RadioGroup = ({ children, ...props }: RadioGroupProps) => {
  return (
    <NextUIRadioGroup
      orientation="horizontal"
      classNames={{
        label: "label",
      }}
      {...props}
    >
      {children}
    </NextUIRadioGroup>
  );
};

export default RadioGroup;
