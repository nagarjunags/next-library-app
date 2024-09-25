export interface ITransactionBase {
  // immutable data which has to kept safe

  bookId: number;
  userId: number;
  returnDate: string;
}

export interface ITransaction extends ITransactionBase {
  transactionId: number;
  issueddate: string;
  isReturned: boolean;
  fine: number;
}
export interface IRequest
{
  bookId:number;
  userId:number;
 
}
