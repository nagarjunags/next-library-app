import {
  readChar,
  readLine,
} from "../../../../../../../data-management/fake/Library-Management/core/input.utils";
import { IInteractor } from "../../../../../../../data-management/fake/Library-Management/core/interactor";
import { IBookBase, IBook } from "./models/books.model";
import { BookRepository } from "./books.repository";
import { Menu } from "../../../../../../../data-management/fake/Library-Management/core/menu";
import { getEditableInput } from "../../../../../../../data-management/fake/Library-Management/core/print.utils";

const menu = new Menu("Book Management", [
  { key: "1", label: "Add Book" },
  { key: "2", label: "Edit Book" },
  { key: "3", label: "Delete Book" },
  { key: "4", label: "Search Book" },
  { key: "5", label: "List Book" },
  { key: "6", label: "<Previous Menu>" },
]);

export class BookInteractor implements IInteractor {
  repo = new BookRepository();

  async showMenu(): Promise<void> {
    let loop = true;
    while (loop) {
      const op = await menu.show();
      if (op) {
        switch (op?.key.toLowerCase()) {
          case "1":
            await addBook(this.repo);
            this.repo.list;
            break;
          case "2":
            await updateBook(this.repo);
            break;
          case "3":
            const id = await readLine("id to delete:");
            let deletedBook = await this.repo.getById(+id);
            console.log("Confirm the book to delete:");
            console.table(deletedBook);
            const choice = await readChar(
              "y to delete or any button to cancel"
            );
            if (choice === "y") {
              deletedBook = await this.repo.delete(+id);
              console.log("Deleted Book:");
              console.table(deletedBook);
            }

            break;
          case "4":
            const key = await readLine("Enter the search key:");
            const result = await this.repo.search(key);
            console.table(result);
            // await searchBook(this.repo);
            // console.table(this.repo.list({ limit: 1000, offset: 0 }).items);
            break;
          case "5":
            const iid = await readLine("enter id:");
            const b = await this.repo.getById(+iid);
            console.log(b);
            // await showPaginatedBooks(this.repo);
            break;
          case "6":
            // await closeConnection(this.repo);
            loop = false;
            break;
          default:
            console.log("\nInvalid input\n\n");
            break;
        }
      } else {
        console.log("\nInvalid input\n\n");
      }
    }
  }
}

async function getBookInput(): Promise<IBookBase> {
  const title = await readLine(`Please enter title:`);
  const author = await readLine(`Please enter author:`);
  const publisher = await readLine(`Please enter publisher:`);
  const genre = await readLine(`Please enter genre:`);
  const isbnNo = await readLine(`Please enter isbnNo:`);
  const numofPages = +(await readLine(`Please enter number of pages:`));
  const totalNumberOfCopies = +(await readLine(
    `Please enter total num of Copies:`
  ));

  return {
    title: title,
    author: author,
    publisher: publisher,
    genre: genre,
    isbnNo: isbnNo,
    numofPages: numofPages,
    totalNumberOfCopies: totalNumberOfCopies,
  };
}

export async function addBook(repo: BookRepository) {
  const book: IBookBase = await getBookInput();
  const createdBook = await repo.create(book);
  console.log("Book added successfully\nBook Id:");
  console.table(createdBook);
}

async function updateBook(repo: BookRepository) {
  const id = +(await readLine("Please enter the ID of the book to update:"));
  let book = await repo.getById(id)!;
  // console.log(book);
  if (!book) {
    console.log(`Book with ID ${id} not found.`);
    return;
  }
  book.title = await getEditableInput("Please updated title: ", book.title);
  book.author = await getEditableInput("Please updated author: ", book.author);
  book.publisher = await getEditableInput(
    "Please update publisher: ",
    book.publisher
  );
  book.genre = await getEditableInput("Please updated genre: ", book.genre);
  book.isbnNo = await getEditableInput("Please updated ISBN.NO: ", book.isbnNo);
  book.numofPages = +(await getEditableInput(
    "Please update number of pages: ",
    book.numofPages
  ));
  book.totalNumberOfCopies = +(await getEditableInput(
    "Please update total number of copies: ",
    book.totalNumberOfCopies
  ));
  book = await repo.update(id, book);
  //   console.log("Updated Successfully");
  console.table(book);
}

async function deleteBook(repo: BookRepository) {
  const bookId = await readLine(`Please enter book id to delete:`);
  const deletedBook = await repo.delete(+bookId);
  console.log("Book deleted successfully\nDeleted Book:");
  console.table(deletedBook);
}

async function searchBook(repo: BookRepository) {
  const Searchkey = await readLine("Enter the search key:");
  repo.search(Searchkey);
}

// async function closeConnection(repo: BookRepository) {
//   repo.close();
// }

// async function showPaginatedBooks(repo: BookRepository): Promise<void> {
//   let offset = 0;
//   const limit = 10; // Number of items per page

//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: true,
//   });

//   readline.emitKeypressEvents(process.stdin);
//   if (process.stdin.isTTY) {
//     process.stdin.setRawMode(true);
//   }

//   const handleKeyPress = (
//     chunk: Buffer,
//     key: { name: string; sequence: string }
//   ) => {
//     if (key.name === "q") {
//       rl.close();
//       return; // Exit the function to return to the books menu
//     }
//     if (
//       key.name === "right" &&
//       repo.list({ limit, offset }).pagination.hasNext
//     ) {
//       offset += limit;
//     } else if (
//       key.name === "left" &&
//       repo.list({ limit, offset }).pagination.hasPrevious
//     ) {
//       offset -= limit;
//     } else if (key.name === "q") {
//       rl.close();
//       return; // Exit the function to return to the books menu
//     }
//     showPage();
//   };

//   const showPage = () => {
//     const response = repo.list({ limit, offset });
//     console.clear();
//     console.table(response.items);
//     console.log(
//       "Press '←' for next page, '→' for previous page, or 'q' to quit."
//     );
//   };

//   process.stdin.on("keypress", handleKeyPress);
//   showPage();

//   await new Promise<void>((resolve) => {
//     rl.on("close", resolve);
//   });

//   process.stdin.removeListener("keypress", handleKeyPress);
//   if (process.stdin.isTTY) {
//     process.stdin.setRawMode(false);
//   }
//   process.stdin.resume();
// }

const a = new BookInteractor();
a.showMenu();
