import logo from "../../styles/images/admin.png";
import { IonIcon } from "@ionic/react";
import { book, library, people, reader } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../AdminDashboardcss/Dashboard.css";
import { toast } from "react-hot-toast";

function AdminDashboard() {
  const adminId = sessionStorage.getItem("adminId");

  const [books, setBooks] = useState([]);
  const [editID, setEditID] = useState(-1);
  const [bookTitle, setbookTitle] = useState("");
  const [author, setauthor] = useState("");
  const [category, setcategory] = useState("");
  const [description, setdescription] = useState("");
  const [quantity, setquantity] = useState("");
  const [availability, setAvailability] = useState("");
  const [publishedDate, setpublishedDate] = useState("");

  const [uBookTitle, usetbookTitle] = useState("");
  const [uQuantity, usetquantity] = useState("");
  const [uAvailability, usetAvailability] = useState("");
  const [uDescription, usetdescription] = useState("");

  const [totalMembers, setTotalMembers] = useState("");
  const [totalBooks, setTotalBooks] = useState("");
  const [totalAvailability, setTotalAvailability] = useState("");
  const [totalIssued, setTotalIssued] = useState("");
  const [loading, setLoading] = useState(true);

  // Admin name
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/admin/${adminId}`)
      .then((response) => setAdminName(response.data.name))
      .catch((error) => console.log(error));
  }, [adminId]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/users")
      .then((response) => {
        setTotalMembers(response.data.length);
        let count = response.data.reduce(
          (sum, user) => sum + user.numBookBorrowed,
          0
        );
        setTotalIssued(count);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/books")
      .then((response) => {
        setBooks(response.data);
        setTotalBooks(response.data.length);
        let count = response.data.reduce(
          (sum, book) => sum + book.availability,
          0
        );
        setTotalAvailability(count);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    axios.get(`http://localhost:8080/books/${id}`).then((res) => {
      usetbookTitle(res.data.bookTitle);
      usetquantity(res.data.quantity);
      usetAvailability(res.data.availability);
      usetdescription(res.data.description);
      setauthor(res.data.author);
      setpublishedDate(res.data.publishedDate);
      setcategory(res.data.category);
    });
    setEditID(id);
  };

  const handleUpdate = () => {
    if (uQuantity < 0 || uAvailability < 0) {
      toast.error("Invalid negative value");
      return;
    }

    axios
      .put(`http://localhost:8080/books/${editID}`, {
        id: editID,
        bookTitle: uBookTitle,
        author: author,
        category: category,
        quantity: uQuantity,
        availability: uAvailability,
        description: uDescription,
        publishedDate: publishedDate,
      })
      .then(() => {
        toast.success("Book updated successfully!");
        window.location.reload();
      })
      .catch((err) =>
        toast.error(err.response?.data || "Failed to update book.")
      );
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8080/books/${id}`);
      toast.success(res.data); // Show success message
      window.location.reload();
    } catch (err) {
      let errorMessage = "An error occurred";

      if (err.response && err.response.data) {
        errorMessage =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message ||
              "Cannot delete book due to dependencies.";
      }

      toast.error(errorMessage);
    }
  };

  const generatePdf = () => {
    const newWindow = window.open("http://localhost:8080/pdf/books", "_blank");
    if (newWindow) {
      toast.success("Generating PDF");
    } else {
      toast.error("Failed generating PDF");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="main">
      <div className="topbar">
        <h3 style={{ margin: "4px", padding: "4px", color: "#2d6d05" }}>
          Hello, {adminName}
        </h3>
        <div className="user">
          <img className="navLogo" src={logo} alt="logo" />
        </div>
      </div>
      <div className="cardBox">
        <div className="card">
          <div>
            <div className="numbers">{totalBooks}</div>
            <div className="cardName">Total Books</div>
          </div>
          <div className="iconBx">
            <IonIcon icon={library}></IonIcon>
          </div>
        </div>
        <div className="card">
          <div>
            <div className="numbers">{totalAvailability}</div>
            <div className="cardName">Available Books</div>
          </div>
          <div className="iconBx">
            <IonIcon icon={reader}></IonIcon>
          </div>
        </div>
        <div className="card">
          <div>
            <div className="numbers">{totalIssued}</div>
            <div className="cardName">Issued Books</div>
          </div>
          <div className="iconBx">
            <IonIcon icon={book}></IonIcon>
          </div>
        </div>
        <div className="card">
          <div>
            <div className="numbers">{totalMembers}</div>
            <div className="cardName">Total Members</div>
          </div>
          <div className="iconBx">
            <IonIcon icon={people}></IonIcon>
          </div>
        </div>
      </div>
      <div id="dashboard-container">
        <table className="dashboard-table" id="book-list">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Book Name</th>
              <th>Quantity</th>
              <th>Availability</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) =>
              book.id === editID ? (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>
                    <input
                      type="text"
                      value={uBookTitle}
                      onChange={(e) => usetbookTitle(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={uQuantity}
                      onChange={(e) => usetquantity(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={uAvailability}
                      onChange={(e) => usetAvailability(e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      value={uDescription}
                      onChange={(e) => usetdescription(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Update</button>
                  </td>
                </tr>
              ) : (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.bookTitle}</td>
                  <td>{book.quantity}</td>
                  <td>{book.availability}</td>
                  <td>{book.description}</td>
                  <td>
                    <button onClick={() => handleEdit(book.id)}>Edit</button>
                    <button onClick={() => confirmDelete(book.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <button className="generatepdf" onClick={generatePdf}>
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
