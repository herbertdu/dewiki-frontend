export function isContainAction(Messages: any[], actionValue: string) {
    if (Messages.length === 0) {
        return false;
    }
    let arr = Messages[0].Tags
    let val = JSON.stringify({ value: actionValue, name: 'Action' });
    return arr.some((arrVal: any) => JSON.stringify(arrVal) === val);
}
