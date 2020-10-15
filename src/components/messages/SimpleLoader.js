
import React, { Component } from 'react'
export const  CenterLoading = (props) => {
    return (
        <div class="d-flex justify-content-center"  style={{padding:'5px'}}>
            <div class="spinner-border" role="status" style={{width: '3rem', height: '3rem'}}>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}