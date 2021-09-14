const submitButton = document.getElementById(`submitButton`);
const addBookButton = document.getElementById(`addBookButton`);
let myLibrary = [{
    title: `The Hobbit`,
    author: `J.R.R. Tolkien`,
    pages: 610,
    isRead: true,
    comments: `Love it! Need to read again soon. The character development in this book is the best that I have ever seen`
}];

function Book(title, author, pages, isRead, comments) {
    this.title = title
    this.author = author
    this.pages = pages
    this.isRead = isRead
    this.comments = comments
}

createCard();
submitButton.addEventListener(`click`, operate);
addBookButton.addEventListener(`click`, showForm);


function operate(event) {
    event.preventDefault();
    addBookToLibrary();
    hideForm();
    createCard();

}

function addBookToLibrary(event) {
    const newBook = createBook();
    myLibrary.push(newBook);
}

function createBook() {
    const title = addBookForm.elements[`bookTitle`].value;
    const author = addBookForm.elements[`bookAuthor`].value;
    const pages = parseInt(addBookForm.elements[`pageCount`].value);
    const isRead = addBookForm.elements[`isReadSwitch`].checked;
    const comments = addBookForm.elements[`optionalComments`].value;
    return new Book(title, author, pages, isRead, comments);
}

function createCard() {
    if (!myLibrary.length) return;

    const currentBook = myLibrary.at(-1);
    console.table(currentBook);

    const bookCard = document.createElement(`div`);
    const bookCardHeader = document.createElement(`div`);
    const editBook = document.createElement(`span`);
    const removeBook = document.createElement(`span`);
    const bookTitle = document.createElement(`h3`);
    const bookAuthor = document.createElement(`h4`);
    const bookPages = document.createElement(`h4`);
    const bookComments = document.createElement(`p`);

    bookCard.classList.add(`book-card`);
    bookCardHeader.classList.add(`book-card-header`);
    editBook.classList.add(`material-icons-outlined`, `edit`);
    removeBook.classList.add(`material-icons-outlined`, `remove`);

    bookTitle.innerText = currentBook.title;
    bookAuthor.innerText = `By: ${currentBook.author}`;
    bookPages.innerText = `Pages: ${currentBook.pages}`;
    bookComments.innerText = currentBook.comments;
    editBook.innerText = `edit`;
    removeBook.innerText = `close`;

    document.getElementById(`bookCardContainer`).appendChild(bookCard);
    bookCard.appendChild(bookCardHeader);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookAuthor);
    bookCard.appendChild(bookPages);
    bookCard.appendChild(bookComments);
    bookCardHeader.appendChild(editBook);
    bookCardHeader.appendChild(removeBook);

}

function showForm() {
    const formContainer = document.getElementById(`formContainer`);
    formContainer.classList.add(`show`);
}

function hideForm() {
    const formContainer = document.getElementById(`formContainer`);
    formContainer.classList.remove(`show`);
}