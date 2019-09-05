// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const { title, author, isbn } = book;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${title}</td>
            <td>${author}</td>
            <td>${isbn}</td>
            <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }   
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        
        div.className = `alert alert-${className}`;
        div.textContent = message;
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        title.value = '';
        author.value = '';
        isbn.value = '';
    }
}

// Get Elements
const container = document.querySelector('.container');
const list = container.querySelector('#book-list');
const form = container.querySelector('#book-form');
const title = form.querySelector('#title');
const author = form.querySelector('#author');
const isbn = form.querySelector('#isbn');

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));    
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        const filterdBooks = books.filter(book => book.isbn != isbn);
        localStorage.setItem('books', JSON.stringify(filterdBooks));      
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate form
    if(title.value === '' || author.value ==='' || isbn.value === '') {
        UI.showAlert('Please fill in all fields.', 'danger');
    } else {
        const book = new Book(title.value, author.value, isbn.value);
    
        // add to UI
        UI.addBookToList(book);

        // add to store
        Store.addBook(book);
    
        UI.clearFields();

        UI.showAlert('Book Added!', 'success');
    }
});

// Event: Remove a Book
list.addEventListener('click', e => {
    // remove from UI
    UI.deleteBook(e.target);
    
    // remove from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed!', 'warning');
});