const db = require('../database/db.js')

{
	const insert_post = db.prepare(/*sql*/ `
  INSERT INTO posts (author, content, flags)
  VALUES ($author, $content, $flags)
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
`)

	function listPosts() {
		return select_all_posts.all()
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
  WHERE flags = ''
`)

	function listSafePosts() {
		return select_safe_posts.all()
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
	const drop_db = db.prepare(/*sql*/ `
  DELETE FROM posts
`)

	function dropDB() {
		drop_db.run()
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
`)

	function selectPost(id) {
		console.log(`ID: ${id}`)

		return select_post.get(id)
	}
}

module.exports = {
	createPost,
	listPosts,
	removePost,
	editPost,
	listSafePosts,
	selectPost,
	dropDB,
}
