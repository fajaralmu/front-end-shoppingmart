import React, {Component} from 'react'
import InstantTable from "../components/InstantTable"
import Label from '../components/Label'
import ComboBoxes from '../components/ComboBoxes'
import * as componentUtil from './ComponentUtil'

export const FilterBox = props => {
    return(
        <div className="filter-box rounded" >
            <InstantTable valign="bottom" rows={props.rows} /> 
        </div>
    )
}

export const DateSelectionFrom = (props) => {
    return (
        <div> <Label text="from date" />
            <ComboBoxes values={[{
                id: "select-month-from",
                defaultValue: props.monthVal,
                options: componentUtil.getDropdownOptionsMonth(),
                handleOnChange:props.handleOnChangeMfrom
            }, {
                id: "select-year-from",
                defaultValue: props.yearVal,
                options: componentUtil.getDropdownOptionsYear(props.years[0], props.years[1]),
                handleOnChange:props.handleOnChangeYfrom
            }]} /></div>)
}

export const DateSelectionTo = (props) => {
    return (
        <div>
            <Label text="to date" />
            <ComboBoxes values={[{
                id: "select-month-to",
                defaultValue: props.monthVal,
                options: componentUtil.getDropdownOptionsMonth(),
                handleOnChange:props.handleOnChangeMto
            },
            {
                id: "select-year-to",
                defaultValue: props.yearVal,
                options: componentUtil.getDropdownOptionsYear(props.years[0], props.years[1]),
                handleOnChange:props.handleOnChangeYto
            }]} />
        </div>
    )
}