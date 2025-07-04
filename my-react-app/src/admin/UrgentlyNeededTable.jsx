import React from "react";

const UrgentBloodTypesTable = () => {
    return (
        <div className="inventory-table">

            <div className="table-container">
                <h2>Urgently Needed Blood Types</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Blood Type</th>
                            <th>Units Needed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>O-</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td>A+</td>
                            <td>20</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UrgentBloodTypesTable;
