# Admin System Front-end (基于视觉认知的交通流量自动识别方法的研究与实现)

This is an Admin System Front-end based on [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

### Prerequisites

Software/Package version requirement:

```
npm <= 8.1.0
node.js <= 16.12.0
```

### Installing

Clone the project and use npm to install dependency

```
# clone the project
git clone https://github.com/DavidZhang0710/x-admin-web.git

# enter the project directory
cd x-admin-web

# install dependency
npm install
```

Here you have a project ready to run.

## Running

First you need to set up the configuration in ```.env.development```, and make sure the value of ```VUE_APP_BASE_API``` is your back-end port.
```
# just a flag
ENV = 'development'

# base api
VUE_APP_BASE_API = 'http://localhost:9999'
```
Now you can run the project.
```
# develop
npm run dev
```

## Further Applications

I also develop a complete system based on this front-end project and [a back-end project](https://github.com/DavidZhang0710/x-admin-back).
For more information, see in the branch [project](https://github.com/DavidZhang0710/x-admin-web/tree/project).


## Built With

* [Vue.js](https://vuejs.org/) - The web framework used
* [Node.js](https://nodejs.org/) - JavaScript Environment Management
* [Element UI](https://element.eleme.io/) - Used to set up Web UI


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details