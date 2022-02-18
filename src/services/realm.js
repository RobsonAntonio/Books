import Realm from "realm";
import BookSchema from '../Schemas/BooksSchemas';

export default function getRealm() {
    return Realm.open({
        schema: [BookSchema]
    });
}