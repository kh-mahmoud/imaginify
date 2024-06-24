import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Control } from "react-hook-form";
import { formSchema } from "./TransformationForm";
import { z } from "zod";



type CustomeFieldProps = {
    name: keyof z.infer<typeof formSchema>;
    control: Control<z.infer<typeof formSchema>>;
    render: (props: { field:any}) => React.ReactNode;
    formLabel?: string;
    className?: string;
  }
  


const CustomeField = ({name,control,render,className,formLabel}:CustomeFieldProps) => {
  return (
    <div>
       <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className={className}>
              <FormLabel >{formLabel}</FormLabel>
              <FormControl>
                   {render({field})}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
}

export default CustomeField;
