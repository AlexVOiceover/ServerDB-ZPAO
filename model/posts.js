const db = require('../database/db.js')

{
	const insert_post = db.prepare(/*sql*/ `
  INSERT INTO posts (author, content)
  VALUES ($author, $content)
  RETURNING id, author, content, postDate, edited, flags
`)

	function createPost(post) {
		return insert_post.get(post)
	}
}

{
  const select_all_posts = db.prepare(/*sql*/ `
  SELECT
    id,
    author,
    content,
    postDate,
    edited,
    flags
  FROM posts
`);

  function listPosts() {
    return select_all_posts.all();
  }
}

{
  const select_safe_posts = db.prepare(/*sql*/ `
  SELECT
    id,
    author,
    content,
    postDate,
    edited,
    flags
  FROM posts
  WHERE flags IS NULL
`);

  function listSafePosts() {
    return select_safe_posts.all();
  }
}

{
	const delete_post = db.prepare(/*sql*/ `
  DELETE FROM posts WHERE id = ?
`)

	function removePost(id) {
		delete_post.run(id)
	}
}

{
	const update_content = db.prepare(/*sql*/ `
  UPDATE posts
  SET content = $content, edited = 1
  WHERE id = $id
  RETURNING id, author, content, postDate, edited
`)

	function editPost(post) {
		return update_content.get(post)
	}
}

{
	const select_post = db.prepare(/*sql*/ `
  SELECT
    id,
    author,
    content,
    postDate,
    edited,
    flags
  FROM posts
  WHERE id = $id
`);

	function selectPost(id) {
		console.log(`ID: ${id}`)

		return select_post.get(id)
	}
}

//const result = createTask({ content: "stuff", complete: 1 });
//console.log(result);

module.exports = {
	createPost,
	listPosts,
	removePost,
	editPost,
	listSafePosts,
	selectPost,
}
