# TypeScript 类型和类型体操知识点汇总

## 基础类型

1. **Boolean**
    ```typescript
    let isDone: boolean = true;
    ```

2. **Number**
    ```typescript
    let decimal: number = 6;
    let hex: number = 0xf00d;
    let binary: number = 0b1010;
    let octal: number = 0o744;
    ```

3. **String**
    ```typescript
    let color: string = "blue";
    color = 'red';
    ```

4. **Array**
    ```typescript
    let list: number[] = [1, 2, 3];
    let list: Array<number> = [1, 2, 3];
    ```

5. **Tuple**
    ```typescript
    let x: [string, number];
    x = ["hello", 10];
    ```

6. **Enum**
    ```typescript
    enum Color {Red, Green, Blue}
    let c: Color = Color.Green;
    ```

7. **Any**
    ```typescript
    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false;
    ```

8. **Void**
    ```typescript
    function warnUser(): void {
        console.log("This is my warning message");
    }
    ```

9. **Null 和 Undefined**
    ```typescript
    let u: undefined = undefined;
    let n: null = null;
    ```

10. **Never**
    ```typescript
    function error(message: string): never {
        throw new Error(message);
    }
    ```

11. **Object**
    ```typescript
    declare function create(o: object | null): void;
    create({ prop: 0 });
    ```

## 接口

1. **基本接口**
    ```typescript
    interface LabelledValue {
        label: string;
    }
    
    function printLabel(labelledObj: LabelledValue) {
        console.log(labelledObj.label);
    }
    
    let myObj = { size: 10, label: "Size 10 Object" };
    printLabel(myObj);
    ```

2. **可选属性**
    ```typescript
    interface SquareConfig {
        color?: string;
        width?: number;
    }
    
    function createSquare(config: SquareConfig): { color: string; area: number } {
        let newSquare = { color: "white", area: 100 };
        if (config.color) {
            newSquare.color = config.color;
        }
        if (config.width) {
            newSquare.area = config.width * config.width;
        }
        return newSquare;
    }
    
    let mySquare = createSquare({ color: "black" });
    ```

3. **只读属性**
    ```typescript
    interface Point {
        readonly x: number;
        readonly y: number;
    }
    
    let p1: Point = { x: 10, y: 20 };
    ```

4. **联合类型**
   ```typescript
   function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${typeof padding}'.`);
    }

5. **交叉类型**
   ```typescript

   function extend<T, U>(first: T, second: U): T & U {
    let result = {} as T & U;
    for (let id in first) {
        (result as any)[id] = (first as any)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (result as any)[id] = (second as any)[id];
        }
    }
    return result;
    }
    const x = extend({ a: "hello" }, { b: 42 });
    let s = x.a;
    let n = x.b;

6. **泛型**
   ```typescript
    function identity<T>(arg: T): T {
    return arg;
    }
    let output1 = identity<string>("myString");
    let output2 = identity<number>(100);
    function loggingIdentity<T>(arg: T[]): T[] {
        console.log(arg.length);
        return arg;
    }


