// Reusable component to represent a field in a form which allows user to edit a certain attribute
// Props: label, placeholder, value, onChange, options (for dropdowns)
import * as React from 'react';
import { FormControl, FormLabel, Select, Input } from '@chakra-ui/react';

export class FormField extends React.Component {
  render() {
    return (
      <FormControl>
        <FormLabel>{this.props.label}</FormLabel>
        {this.props.options ? (
          <Select
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}
          >
            {this.props.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            placeholder={this.props.placeholder}
            value={this.props.value}
            onChange={this.props.onChange}
          />
        )}
      </FormControl>
    );
  }
}
