import React from "react";
const Categories = () => {
    return (
        <div className="container mt-5 pt-5">
            <h1 className="text-center">Categories Page</h1>
            <p className="text-center">This is where you can list your product categories.</p>
            <ul className="list-group">
                <li className="list-group-item">Electronics</li>
                <li className="list-group-item">Clothing</li>
                <li className="list-group-item">Home Appliances</li>
                <li className="list-group-item">Books</li>
            </ul>
        </div>
    );
}
export default Categories;