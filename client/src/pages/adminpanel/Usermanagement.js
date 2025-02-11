import React from 'react'
import './Usermanagement.css'
function Usermanagement() {
  return (
    <div>
        <div class="container">
        <h2 class="title">&lt; User Management</h2>
        <div class="top-bar">
            <input type="text" placeholder="Search" class="search-bar" />
            <button class="add-btn">+ Add New</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date Created</th>
                    <th>Date Modified</th>
                    <th>Last Login Date</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Dhruv Vyas</td>
                    <td>dhruvvyas@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
                <tr>
                    <td>Chirag Rangan</td>
                    <td>chirag90@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
                <tr>
                    <td>Rajesh Khan</td>
                    <td>rajesh_khan@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
                <tr>
                    <td>Aditya More</td>
                    <td>aditya89@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
                <tr>
                    <td>Ajay Das</td>
                    <td>ajay_das@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
                <tr>
                    <td>Amit Chavan</td>
                    <td>amit_c@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
                <tr>
                    <td>Rohit Kumar</td>
                    <td>dhruvvyas@domain.tld</td>
                    <td>20/01/2025 10:09 AM</td>
                    <td>25/01/2025 5:28 PM</td>
                    <td>30/01/2025 12:26 PM</td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
          <div class="paginationLeft">
              <span>Page</span>
              <a href="#" class="prev">&lt;</a>
              <a href="#" class="active">1</a>
              <a href="#">2</a>
              <a href="#">3</a>
              <a href="#">4</a>
              <a href="#" class="next">&gt;</a>
          </div>
          <div  class="paginationRight">
            <span>Showing 10 of 50</span>
          </div>
        </div>
        
    </div>

      
    </div>
  )
}

export default Usermanagement
