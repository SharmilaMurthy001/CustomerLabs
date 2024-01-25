import React, { Component } from "react";
import { Drawer } from "antd";
import "../Styles/Style.css";

export default class SaveSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawerModal: false,
            segmentName: "",
            selectOption: "",
            segbox: false,

            dropdowns: [],
            options: [
                { name: 'First Name', value: 'first_name' },
                { name: 'Last Name', value: 'last_name' },
                { name: 'Gender', value: 'gender' },
                { name: 'Age', value: 'age' },
                { name: 'Account Name', value: 'account_name' },
                { name: 'City', value: 'city' },
                { name: 'State', value: 'state' },
            ],
        };
    }

    getDrawer = (data) => {
        this.setState(
            {
                drawerModal: true,
            }
        );
    };

    handleAddDropdown = () => {
        const { selectOption, dropdowns, options } = this.state;
        this.setState({
            segbox: true,
        });

        if (selectOption) {
            const newDropdowns = [...dropdowns, selectOption];
            const newOptions = options.filter(
                (option) => !newDropdowns.some((dropdown) => dropdown.value === option.name)
            );

            this.setState({
                segbox: true,
                dropdowns: newDropdowns,
                options: newOptions,
                selectOption: '',
            }, () => {
                console.log("Updated State:", this.state);
            });
        }
    };

    handleDropdownChange = (index, value) => {
        const { dropdowns } = this.state;
        const newDropdowns = [...dropdowns];
        newDropdowns[index] = value;

        this.setState({ dropdowns: newDropdowns });
    };

    onClose = () => {
        this.setState(
            {
                drawerModal: false,
            }
        );
    };

    handleOnInputChange = (e, key) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    sendDataToServer = () => {
        const { segmentName, dropdowns, options } = this.state;

        if (segmentName && dropdowns.length > 0) {
            const data = {
                segment_name: segmentName,
                schema: dropdowns.map((selectedOption) => {
                    const selectedOptionDetails = options.find(option => option.value === selectedOption);
                    return {
                        [selectedOption]: selectedOptionDetails ? selectedOptionDetails.name : selectedOption,
                    };
                }),
            };

            fetch("https://webhook.site/daa7fd31-ea8f-47d0-add5-fb0caadfd723", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(result => {
                    console.log("Data sent successfully:", result);
                })
                .catch(error => {
                    console.error("Error sending data:", error);
                });
        } else {
            console.error("Segment Name or Schemas are empty");
        }
    };

    render() {
        let { drawerModal, segmentName, selectOption, segbox, dropdowns, options } = this.state;

        return (
            <>
                <div>
                    <div className="container">

                        <div className="mt-2">
                            <>
                                <button
                                    className="btn btn-outline-primary mt-5"
                                    onClick={() => this.getDrawer("")}
                                >
                                    Save Segment
                                </button>
                            </>
                        </div>

                        {drawerModal === true && (

                            <div className="row">
                                <Drawer
                                    onClose={() => this.onClose()}
                                    open={drawerModal}
                                    className="api-config-drawer"
                                >
                                    <div className="col-lg-12 form">
                                        <div className=" form-group">
                                            <label htmlFor="inputName">
                                                Enter the name of the Segment
                                            </label>
                                            <input
                                                className="form-control form-box"
                                                name="segmentName"
                                                value={segmentName}
                                                placeholder="Name of the Segment"
                                                onChange={(e) =>
                                                    this.handleOnInputChange(e, "")
                                                }
                                            />

                                            <label><small>To save your segment, you need to add the schemas to build the query </small></label>
                                        </div>
                                        {segbox && (
                                            <div className="selected-segment">

                                                {dropdowns.map((dropdown, index) => (

                                                    <select
                                                        key={index}
                                                        value={dropdown}
                                                        onChange={(e) => this.handleDropdownChange(index, e.target.value)}
                                                        disabled={index !== dropdowns.length - 1}
                                                        className="new-dropdown"
                                                    >
                                                        <option value="">
                                                            {dropdown}
                                                        </option>
                                                        {this.state.options.map((option) => (

                                                            !this.state.dropdowns.includes(option.value) && (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.name}
                                                                </option>
                                                            )
                                                        ))}
                                                    </select>

                                                ))}
                                            </div>
                                        )}
                                        <div className="wrap-content">
                                            <select
                                                className="main-dropdown"
                                                value={selectOption}
                                                name="selectOption"
                                                onChange={(e) => this.handleOnInputChange(e, "drop-down")}
                                            >
                                                <option value="">Select</option>
                                                {this.state.options.map((option) => (
                                                    !this.state.dropdowns.includes(option.value) && (
                                                        <option key={option.value} value={option.value}>
                                                            {option.name}
                                                        </option>
                                                    )
                                                ))}
                                            </select>

                                            <div className="mt-3 add-link">
                                                <button className="newly-add" onClick={this.handleAddDropdown}>+ Add new schema</button>
                                            </div>
                                        </div>

                                        <hr></hr>
                                    </div>

                                    <div className="footer">
                                        <div className="footer-content">
                                            <button className="newly-save" onClick={() => this.sendDataToServer()}>
                                                Save the Segment
                                            </button>
                                            <button className="newly-cancel" onClick={() => this.onClose()}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Drawer>
                            </div>
                        )}
                    </div>
                </div>

            </>
        );
    }
}
