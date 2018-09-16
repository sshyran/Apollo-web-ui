import React from 'react';
import {Text} from 'react-form';


class InputForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue || ''
        };
    };

    handleChange = (value) => {
        if (this.props.onChange) this.props.onChange(value);
        this.props.setValue(this.props.field, this.validateInput(value));
    };

    validateInput = (value) => {
        if (this.props.type === "number") {
            // value = value.replace(/[^\d.]|\.(?=.*\.)/g,""); // float numbers
            value = value.replace(/[^\d]/g,"");
        } else {
            value = value.replace(/[.,;:`'"%!#&~<>@_=*+?^${}|[\]\\]/g, "");
        }
        this.setState({ value });
        return value;
    };

    handleClickUp = () => {
        let value = this.state.value !== '' ? parseInt(this.state.value) : 0;
        value = value+ 1; // or parseFloat
        this.props.setValue(this.props.field, value);
        this.setState({ value });
    };

    handleClickDown = () => {
        let value = this.state.value !== '' ? parseInt(this.state.value) : 0;
        if (value > 0) {
            value = value - 1; // or parseFloat
            this.props.setValue(this.props.field, value);
            this.setState({value});
        }
    };

    render() {
        return (
            <div className="input-text-wrap">
                <Text
                    onChange={this.handleChange}
                    value={this.state.value}
                    className={`form-control ${this.props.className}`}
                    field={this.props.field}
                    defaultValue={this.props.defaultValue}
                    placeholder={this.props.placeholder}
                    minLength={this.props.minLength}
                />
                {this.props.type === "number" &&
                <div className="input-number-wrap">
                    <div className="input-number-up" onClick={this.handleClickUp}/>
                    <div className="input-number-down" onClick={this.handleClickDown}/>
                </div>
                }
            </div>
        );
    }
}

export default InputForm;