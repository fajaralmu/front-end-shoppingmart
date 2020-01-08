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
                defaultValue: componentUtil.getCurrentMMYY()[0],
                options: componentUtil.getDropdownOptionsMonth(),
                handleOnChange:props.handleOnChange
            }, {
                id: "select-year-from",
                defaultValue: componentUtil.getCurrentMMYY()[1],
                options: componentUtil.getDropdownOptionsYear(2017, 2020),
                handleOnChange:props.handleOnChange
            }]} /></div>)
}

export const DateSelectionTo = (props) => {
    return (
        <div>
            <Label text="to date" />
            <ComboBoxes values={[{
                id: "select-month-to",
                defaultValue: componentUtil.getCurrentMMYY()[0],
                options: componentUtil.getDropdownOptionsMonth(),
                handleOnChange:props.handleOnChange
            },
            {
                id: "select-year-to",
                defaultValue: componentUtil.getCurrentMMYY()[1],
                options: componentUtil.getDropdownOptionsYear(2017, 2020),
                handleOnChange:props.handleOnChange
            }]} />
        </div>
    )
}