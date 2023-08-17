export default interface ApplicationCommandResponseOption {
    type: number;
    name: string;
    value: string;
    options: Array<ApplicationCommandResponseOption>
}