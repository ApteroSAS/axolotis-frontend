console.log("start generating code");
//Parse the ts file find the class that extends WebpackModuleLoader and generate the file axolotis-frontend\src\generated\webpack\module
const ts = require("typescript");
const tsutils = require("tsutils");
var fs = require('fs');
var path = require('path');

let webpackInterfaceName = "WebpackAsyncModuleFactory";
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

function getFullTypeName (
    checker, //: ts.TypeChecker
    tp/*: ts.Type*/){
    if(tp.symbol){
        return checker.getFullyQualifiedName(tp.symbol)
    } else {
        return ""
    }
}

function getFullNodeName (
    checker, //: ts.TypeChecker
    nd/*: ts.Node*/){
    const tp =checker.getTypeAtLocation(nd)
    return getFullTypeName(checker,tp)
}

function printBaseClass(
    checker, //: ts.TypeChecker
     cd /*: ts.ClassDeclaration*/){
    // console.log(cd)
    if(!cd.heritageClauses){
        return;
    }
    for(const hc of cd.heritageClauses) {
        console.log("heritage clause: " + hc.getText())
        //console.log("hc name " + getFullNodeName(checker,hc))
        for(const hctp of hc.types){
            let tp = checker.getTypeFromTypeNode(hctp)
            console.log(getFullTypeName(checker,tp))

            if (tsutils.isTypeReference(tp)) {
                let dcs = tp.target.symbol.declarations
                console.log(dcs.length + " declarations")
                for(const dc of dcs){
                    console.log(getFullNodeName(checker,dc))
                    if(tsutils.isClassDeclaration(dc)){
                        for(const mb of dc.members){
                            console.log("  member " + mb.getText())
                        }
                    }
                }
            }
        }
    }
}

function doesClassImplementInterface(
    checker, //: ts.TypeChecker
    cd /*: ts.ClassDeclaration*/){
    // console.log(cd)
    if(!cd.heritageClauses){
        return;
    }
    for(const hc of cd.heritageClauses) {
        console.log("heritage clause: " + hc.getText())
        //console.log("hc name " + getFullNodeName(checker,hc))
        for(const hctp of hc.types){
            let tp = checker.getTypeFromTypeNode(hctp)
            console.log(getFullTypeName(checker,tp))

            if (tsutils.isTypeReference(tp)) {
                let dcs = tp.target.symbol.declarations
                console.log(dcs.length + " declarations")
                for(const dc of dcs){
                    console.log(getFullNodeName(checker,dc))
                    if(tsutils.isClassDeclaration(dc)){
                        for(const mb of dc.members){
                            console.log("  member " + mb.getText())
                        }
                    }
                }
            }
        }
    }
}

function generateWebpackModules(
    fileNames,// string[],
    options//ts.CompilerOptions
){
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return (
            (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
        );
    }

    let factoryInterfaceNode = null;
    // Visit every sourceFile in the program to find interface
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, (node)=>{
                if (isNodeExported(node) && ts.isInterfaceDeclaration(node) && node.name) {
                    // This is a top level class, get its symbol
                    let symbol = checker.getSymbolAtLocation(node.name);
                    if (symbol && node.name.escapedText === webpackInterfaceName) {
                        factoryInterfaceNode = node;
                    }
                    // No need to walk any further, class expressions/inner declarations
                    // cannot be exported
                }
            });
        }
    }


    let nodes = {};
    // Visit every sourceFile in the program to find interface
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            ts.forEachChild(sourceFile, (node)=>{
                if(isNodeExported(node) && node.name && (ts.isInterfaceDeclaration(node) || ts.isClassDeclaration(node))) {
                    nodes[node.name.escapedText] = { node, sourceFile,fileName :sourceFile.fileName};
                }
            });
        }
    }

    function doesClassImplementInterface(
        classDec , //: ts.ClassDeclaration,
        interfaceDec, //: ts.InterfaceDeclaration,
        typeChecker, //: ts.TypeChecker
    ) {
        if(!ts.isClassDeclaration(classDec)){
            return false;
        }
        if(doesClassDirectlyImplementInterface(classDec,interfaceDec,typeChecker)){
            return true;
        }else {
            if(!classDec.heritageClauses){
                return false;
            }
            let heritageClauses = classDec.heritageClauses
                ?.filter(c => {
                    return ((c.token === ts.SyntaxKind.ImplementsKeyword) || (c.token === ts.SyntaxKind.ExtendsKeyword));
                } );
            for (const implementsClause of heritageClauses) {
                for (const clauseTypeNode of implementsClause?.types ?? []) {
                    const clauseType = typeChecker.getTypeAtLocation(clauseTypeNode);
                    const sourceFile = clauseTypeNode.expression.getSourceFile();
                    let symbol = clauseType.getSymbol() || checker.getSymbolAtLocation(clauseTypeNode.expression);
                    const node = nodes[clauseTypeNode.expression];
                    const typesDeclared = checker.getDeclaredTypeOfSymbol(symbol);
                    for(const classNode of (symbol?.declarations || [])) {
                        let symbol2 = checker.getTypeAtLocation(classNode.name);
                        if (doesClassImplementInterface(classNode, interfaceDec, typeChecker)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }

    function doesClassDirectlyImplementInterface(
        classDec , //: ts.ClassDeclaration,
        interfaceDec, //: ts.InterfaceDeclaration,
        typeChecker, //: ts.TypeChecker
    ) {
        if(!classDec.heritageClauses){
            return false;
        }
        let heritageClauses = classDec.heritageClauses
            ?.filter(c => {
                return ((c.token === ts.SyntaxKind.ImplementsKeyword) || (c.token === ts.SyntaxKind.ExtendsKeyword));
            } );

        for (const implementsClause of heritageClauses) {
            for (const clauseTypeNode of implementsClause?.types ?? []) {
                const clauseType = typeChecker.getTypeAtLocation(clauseTypeNode);
                if (clauseType.getSymbol()?.declarations.some(d => d === interfaceDec))
                    return true;
            }
        }

        return false;
    }

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, (node)=>{
                // Only consider exported nodes
                if (!isNodeExported(node)) {
                    return;
                }
                if (ts.isClassDeclaration(node) && node.name) {
                    // This is a top level class, get its symbol
                    let symbol = checker.getSymbolAtLocation(node.name);
                    if (symbol) {
                        printBaseClass(checker,node);
                        if (doesClassImplementInterface(node, factoryInterfaceNode, checker)) {
                            console.log(node.name.escapedText);
                        }
                    }
                }else if (ts.isModuleDeclaration(node)) {
                    // This is a namespace, visit its children
                    ts.forEachChild(node, visit);
                }
            });
        }
    }
}

walk("./src", function(err, results) {
    if (err) throw err;
    results = results.filter( file => {
        return file.endsWith(".ts");
    });
    const configPath = ts.findConfigFile(
        /*searchPath*/ "./",
        ts.sys.fileExists,
        "tsconfig.json"
    );
    var options = fs.readFileSync( configPath );
    generateWebpackModules(results,options)
});


//https://stackoverflow.com/questions/59518993/typescript-compiler-api-function-which-can-check-if-a-class-implements-an-interf
