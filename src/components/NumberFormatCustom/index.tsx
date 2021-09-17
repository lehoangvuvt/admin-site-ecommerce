import NumberFormat from 'react-number-format'

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    id:string;
  }

export function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;
    // console.log(other.id);
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator={(other.id === "%") ? false: true}
        isNumericString
        prefix={other.id}
        allowEmptyFormatting={true}
        allowNegative={false}
        isAllowed={(values) => {
            const floatValue:any = values.floatValue;
            if (other.id !== "%" ) return true;
            return !floatValue || (floatValue >= 0 && floatValue<=100);
        }}
      />
    );
  }
