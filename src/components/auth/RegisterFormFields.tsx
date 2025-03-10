
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from './RegisterFormTypes';
import PasswordField from './PasswordField';
import SchoolSelector from './SchoolSelector';

interface RegisterFormFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

const RegisterFormFields = ({ form }: RegisterFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Choose a username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="your.email@school.edu" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <PasswordField form={form} />
      
      <SchoolSelector form={form} />
    </>
  );
};

export default RegisterFormFields;
