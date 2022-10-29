//book class: Represents a book
//every time you create a book it instantiates a book object
class Book {
    constructor(title, author, isbn) {
        this.title= title;
        this.author = author;
        this.isbn= isbn;
    }
};

//UI class: to handle UI tasks like when a book displays, shows an alert, or is removed
class UI {//Why are both letters uppercase? 
    static displayBooks(){
        const books = Store.getBooks();
        // Loop through all the books, and add the book to list
        books.forEach((book) => UI.addBookToList(book));
    }
        static addBookToList(book) {
            const list = document.querySelector("#book-list");
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class="btn btn-danger btn-sm delete"> X </a></td>`;//btn = bootstrap stylesheet? btn-danger red,sm=small, delete class
            //use backticks so that you can use a variable within a string
            list.appendChild(row);
        }
        static deleteBook(el){
            if(el.classList.contains("delete")){
                el.parentElement.parentElement.remove(); //we remove the parent of the parent because the first parent will just delte the <td> but you want the <tr> removed
            }
        }
        static showAlert(message, className) {
            const div = document.createElement("div"); //build the div from scratch and enter it in the UI with JS
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));//put text in the div
            const container = document.querySelector(".container");
            const form = document.querySelector("#book-form");
            container.insertBefore(div, form);
            //Make alert go away after 3 seconds
            setTimeout(() => document.querySelector(".alert").remove(),3000)
        }
        static clearFields(){
            document.querySelector("#title").value = "";
            document.querySelector("#author").value = "";
            document.querySelector("#isbn").value = ""
        }

    }   

//store class: handles storage (local within the browser)
class Store {
    static getBooks(){
        let books;
        if (localStorage.getItem("books")=== null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books)); 
    }

    static removeBook(isbn){
        const books = Store.getBooks(); 
        books.forEach((book, index)=> {
            if (book.isbn === isbn) {
                books.splice(index,1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}



//events: display books- show book in the list 
document.addEventListener("DOMContentLoaded", UI.displayBooks)



//Event: Add a book 
document.querySelector("#book-form").addEventListener("submit", (e) => {
//prevent actual submit. Because it is a submit event, we have to prevent the default value? 
e.preventDefault();

//Get form values
const title = document.querySelector("#title").value;
const author = document.querySelector("#author").value;
const isbn = document.querySelector("#isbn").value; 
// vallidate 
if (title === "" || author === "" || isbn ==="") {
    UI.showAlert ("Please fill in all fields", "danger");
} else {
//instatiate book
const book = new Book(title, author, isbn); 
//add book to UI
UI.addBookToList(book);

// Add book to store. This also adds the book to local storage so that if you refresh the page, it's still there. Will format as an array of objects in as a string
Store.addBook(book); //to test out if the book was added to local storage, to application tab to local storage, to local host 

//show success message
UI.showAlert("Book Added", "success");
//clear fields
UI.clearFields();
}

});

//Event: remove a book 
document.querySelector("#book-list").addEventListener("click", (e) => {
   //remove book from UI
    UI.deleteBook(e.target); 
    // remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show book removed message
UI.showAlert("Book Removed", "danger");
 });