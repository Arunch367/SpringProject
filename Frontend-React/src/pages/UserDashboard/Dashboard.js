// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import logo from '../../styles/images/user.png';
// import { toast } from 'react-hot-toast';
// import { useResolvedPath } from 'react-router-dom';
// // import "../../UserDashboardcss/UserDashboard.css"

// function Dashboard() {

//     // get books
//     const [books, setBooks] = useState([]);
//     const [bookStatuses, setBookStatuses] = useState({});
//     useEffect(() => {
//         axios.get('http://localhost:8080/books')
//             .then(response => {
//                 // console.log(response.data[0].id);
//                 setBooks(response.data);
//                 // hide the request button
//                 axios.get('http://localhost:8080/requests')
//                     .then(response => {
//                         const statusDict = response.data.reduce((acc, request) => {
//                             const bookId = request.book.id;
//                             const status = request.status;
//                             acc[bookId] = status;
//                             return acc;
//                         }, {});
//                         setBookStatuses(statusDict);
//                     })
//                     .catch(error => {
//                         console.log(error);
//                     });
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     }, []);
//     const userId = sessionStorage.getItem('userId');
//     const [userName, setUserName] = useState("");
//     // console.log(userId);

//     // get user
//     useEffect(() => {
//         axios.get('http://localhost:8080/users/' + userId)
//             .then(response => {
//                 setUserName(response.data.name);
//             })
//     })

//     // borrow book
//     const handleBorrow = (id) => {
//         axios.post('http://localhost:8080/borrow', { user: { id: userId }, book: { id: id } })
//             .then(response => {
//                 // console.log(response.data);
//                 // window.location.reload(true);
//                 axios.post('http://localhost:8080/requests', { user: { id: userId }, book: { id: id } })
//                     .then(response => {
//                         toast.success("Book requested");
//                         setTimeout(() => {
//                             window.location.reload(false);
//                         }, 500);
//                     }).catch(error => {
//                         toast.error("Unable to request");
//                     })
//             })
//             .catch(error => {
//                 toast.error("Failed, max 2 request");
//                 console.log(error);
//             });
//     };

//     // get rating
//     const [averageRatings, setAverageRatings] = useState({});
//     useEffect(() => {
//         axios.get('http://localhost:8080/ratings')
//             .then(response => {
//                 const ratingMap = {};
//                 for (let i = 0; i < response.data.length; i++) {
//                     const bookId = response.data[i].book.id;
//                     const rating = response.data[i].rating;
//                     if (ratingMap[bookId]) {
//                         ratingMap[bookId].totalRating += rating;
//                         ratingMap[bookId].numRatings += 1;
//                     } else {
//                         ratingMap[bookId] = { totalRating: rating, numRatings: 1 };
//                     }
//                 }
//                 const newAverageRatings = {};
//                 for (const [bookId, ratingInfo] of Object.entries(ratingMap)) {
//                     const averageRating = ratingInfo.totalRating / ratingInfo.numRatings;
//                     newAverageRatings[bookId] = averageRating.toFixed(1); // format to one decimal place
//                 }
//                 setAverageRatings(newAverageRatings);
//             })
//     }, []);

//     // console.log(averageRatings);

//     return (
//         <div class="main">
//             <div class="topbar">
//                 <h3 style={{ margin: '4px', padding: '4px', color: '#2d6d05' }}>Hello, {userName}</h3>
//                 <div class="user">
//                     <img class="navLogo" src={logo} alt="logo" />
//                 </div>
//             </div>
//             <div id="dashboard-container" style={{ marginTop: "2rem" }}>
//                 <table class="dashboard-table" id="book-list">
//                     <thead>
//                         <tr>
//                             <th>Book ID</th>
//                             <th>Book Name</th>
//                             <th>Quantity</th>
//                             <th>Availability</th>
//                             <th>Description</th>
//                             <th>Ratings</th>
//                             <th>Request Books</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {books.map(book => (
//                             <tr key={book.id}>
//                                 <td>{book.id}</td>
//                                 <td>{book.bookTitle}</td>
//                                 <td>{book.quantity}</td>
//                                 <td>{book.availability}</td>
//                                 <td>{book.description}</td>
//                                 <td>
//                                     {averageRatings[book.id] ? (
//                                         <strong>{averageRatings[book.id]}</strong>
//                                     ) : (
//                                         '0.0'
//                                     )} / 5
//                                 </td>
//                                 <td class="Request">
//                                     {bookStatuses[book.id] === 'REQUESTED' ? (
//                                         <span>Requested</span>
//                                     ) : (
//                                         <button
//                                             className="request-button"
//                                             type="button"
//                                             onClick={() => handleBorrow(book.id)}
//                                         >
//                                             Request
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import logo from "../../styles/images/user.png";
import { toast } from "react-hot-toast";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [bookStatuses, setBookStatuses] = useState({});
  const [userName, setUserName] = useState("");
  const [averageRatings, setAverageRatings] = useState({});

  const userId = localStorage.getItem("userId");

  // ✅ Fetch books & ratings in one request
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/books"),
      axios.get("http://localhost:8080/ratings"),
    ])
      .then(([booksRes, ratingsRes]) => {
        setBooks(booksRes.data);

        // Compute average ratings
        const ratingMap = ratingsRes.data.reduce((acc, { book, rating }) => {
          acc[book.id] = acc[book.id] || { total: 0, count: 0 };
          acc[book.id].total += rating;
          acc[book.id].count += 1;
          return acc;
        }, {});

        setAverageRatings(
          Object.fromEntries(
            Object.entries(ratingMap).map(([id, { total, count }]) => [
              id,
              (total / count).toFixed(1),
            ])
          )
        );
      })
      .catch((error) => console.log(error));
  }, []);

  // ✅ Fetch user details & request statuses
  useEffect(() => {
    if (!userId) return;

    Promise.all([
      axios.get(`http://localhost:8080/users/${userId}`),
      axios.get(`http://localhost:8080/requests/user/${userId}`),
    ])
      .then(([userRes, requestsRes]) => {
        setUserName(userRes.data.name);

        const statusDict = requestsRes.data.reduce((acc, request) => {
          if (request.status !== "REJECTED" && request.status !== "RETURNED") {
            acc[request.book.id] = request.status;
          }
          return acc;
        }, {});
        setBookStatuses(statusDict);
      })
      .catch((error) => console.log(error));
  }, [userId]);

  // ✅ Handle book request (memoized for performance)
  const handleBorrow = useCallback(
    async (id) => {
      try {
        // First request to borrow the book
        await axios.post("http://localhost:8080/borrow", {
          user: { id: userId },
          book: { id },
        });

        // Second request only runs if the first one succeeds
        await axios.post("http://localhost:8080/requests", {
          user: { id: userId },
          book: { id },
        });

        toast.success("Book requested");
        setBookStatuses((prev) => ({ ...prev, [id]: "REQUESTED" }));
      } catch (error) {
        const errorMessage =
          error.response?.data?.errorMessage || "Something went wrong.";

        if (errorMessage.includes("out of stock")) {
          toast.error(errorMessage); // Shows "Book 1 is out of stock!"
        } else if (errorMessage.includes("2 active borrow requests")) {
          toast.error("You already have 2 active requests.");
        } else {
          toast.error(errorMessage);
        }
      }
    },
    [userId]
  );

  return (
    <div className="main">
      <div className="topbar">
        <h3 style={{ margin: "4px", padding: "4px", color: "#2d6d05" }}>
          Hello, {userName}
        </h3>
        <div className="user">
          <img className="navLogo" src={logo} alt="logo" />
        </div>
      </div>
      <div id="dashboard-container" style={{ marginTop: "2rem" }}>
        <table className="dashboard-table" id="book-list">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Availability</th>
              <th>Description</th>
              <th>Ratings</th>
              <th>Request Books</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.bookTitle}</td>
                <td>{book.quantity}</td>
                <td>{book.availability}</td>
                <td>{book.description}</td>
                <td>{averageRatings[book.id] || "0.0"} / 5</td>
                <td>
                  {bookStatuses[book.id] === "REQUESTED" ? (
                    <span>Requested</span>
                  ) : (
                    <button onClick={() => handleBorrow(book.id)}>
                      Request
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
