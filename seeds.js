const Note = require("./models/note");
const Notebook = require("./models/notebook");
const User = require("./models/user");
const faker = require("faker");

module.exports = async(authorId, numNotebooks, numNotesXNotebook)=>{
    const user = await User.findById(authorId);
    await Note.deleteMany({});
    await Notebook.deleteMany({});
    // create numNotebooks notebooks
    for(let j = 0; j<numNotebooks; j++){
        let notebook = await Notebook.create({
            title: faker.lorem.words(5),
            author: user,
        });
        // create numNotesXNotebook notes
        for(let i = 0; i<numNotesXNotebook; i++){
            notebook.notes.push(await Note.create(
                {
                    body: faker.lorem.words(10),
                    pointed: Math.random() >= 0.5,
                    author: user._id
                }
            ));
        }
        await notebook.save(); // SAVE NOTEBOOK
    }
    console.log(`${numNotebooks} notebooks created with ${numNotesXNotebook} notes each`);
}