const addBook = document.getElementById('submitButton');
let myLibrary = [];

addBook.addEventListener('click', addBookToLibrary);

function Book(title, author, pages, isRead, comments) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
    this.comments = comments
}

function addBookToLibrary(event) {
    event.preventDefault();
    const newBook = createBook();
    myLibrary.push(newBook);
}

function createBook() {
    const title = addBookForm.elements['bookTitle'].value;
    const author = addBookForm.elements['bookAuthor'].value;
    const pages = addBookForm.elements['pageCount'].value;
    const isRead = addBookForm.elements['isReadSwitch'].checked;
    const comments = addBookForm.elements['optionalComments'].value;
    return new Book(title, author, pages, isRead, comments);
}