const express = require('express');
const db = require('./data/db');

const router = express.Router();

router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({
                error: "The posts information could not be retrieved."
            });
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    if(id) {
        db.findById(id)
            .then(post => {
                res.status(200).json(post);
            })
            .catch(err => {
                res.status(500).json({
                    error: "The post information could not be retrieved."
                });
            });
    } else {
        res.status(400).json({
            message: "The post with the specified ID does not exist."
        });
    }
});

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    if(id) {
        db.findPostComments(id)
            .then(comments => {
                res.status(200).json(comments);
            })
            .catch(err => {
                res.status(500).json({
                    error: "The comments information could not be retrieved."
                });
            });
    } else {
        res.status(404).json({
            message: "The post with the specified ID does not exist."
        });
    }
});

router.post('/', (req, res) => {
    if(req.body.title || req.body.contents) {
        db.insert(req.body)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                });
            });
    } else {
        res.status(400).json({
            message: "Please provide title and contents for the post."
        });
    }
});

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;

    const comment = req.body;
    comment.post_id = req.params.id;

    db.findById(id)
        .then(post => {
            if(post) {
                if(req.body.text) {
                    db.insertComment(comment)
                        .then(postComment => {
                            res.status(201).json(postComment);
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: "There was an error while saving the comment to the database"
                            });
                        });
                } else {
                    res.status(400).json({
                        message: "Please provide text for the comment."
                    });
                }
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error finding the id post"
            });
        });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    db.remove(id)
        .then(post => {
            if(post) {
                res.status(200).json({
                    message: "The post has been deleted"
                });
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The post could not be removed"
            });
        });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;

    db.update(id, req.body)
        .then(update => {
            if(!update) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                });
            } else if (!req.body.title || !req.body.contents) {
                res.status(400).json({
                    error: "Please provide title and contents for the post."
                });
            } else {
                res.status(200).json(update);
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The post information could not be modified."
            });
        });
});

module.exports = router;