
import React, { Component } from 'react'
export const  CenterLoading = (props) => {
    return (
        <div className="d-flex justify-content-center"  style={{padding:'5px'}}>
            <div className="spinner-border" role="status" style={{width: '3rem', height: '3rem'}}>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}