[![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

# abstract-storage

Collection of objects to easily deal with storage-related matters... before I get to a better description of it! :)

Today, it offers the following objects:

- Repository
- LevelDBStore
- RedisStore


## API

### Store#open

```javascript
	store.open(options, function(error, client) { ...
```

### Store#close

```javascript
	store.close(function(error) { ...
```

### Store#read

```javascript
	store.read(key, function(error, value) { ...
```

### Store#write

```javascript
	store.write(key, value, function(error) { ...
```


### Repository#open

```javascript
	repository.open(options, function(error) { ...
```

### Repository#close

```javascript
	repository.close(function(error) { ...
```

### Repository#read

```javascript
	repository.read(id, function(error, value) { ...
```

### Repository#write

```javascript
	repository.write(id, object, function(error) { ...
```


[npm-image]: https://img.shields.io/npm/v/abstract-storage.svg?style=flat
[npm-url]: https://www.npmjs.com/package/abstract-storage
[travis-image]: https://img.shields.io/travis/pvoisin/abstract-storage.svg?branch=master
[travis-url]: https://travis-ci.org/pvoisin/abstract-storage/
[coveralls-image]: https://coveralls.io/repos/pvoisin/abstract-storage/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/pvoisin/abstract-storage?branch=master