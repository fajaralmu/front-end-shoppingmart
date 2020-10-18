import React  from 'react'
export const TableHeader = (props) => {

    return (<tr>
        {props.values.map(value => <th>{value}</th>)}
    </tr>
    )

}