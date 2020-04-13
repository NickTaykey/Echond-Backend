const Note = require("./models/note");
const User = require("./models/user");
const faker = require("faker");

module.exports = async(authorId, num)=>{
    const user = await User.findById(authorId);
    await Note.deleteMany({});
    for(let i = 0; i<num; i++){
        await Note.create(
            {
                body: faker.lorem.words(10),
                pointed: false,
                author: user._id
            }
        );
    }
    console.log(`${num} notes created`);
}