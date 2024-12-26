import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const SecurityPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Security</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your database security settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This page is under construction. Security settings will be available soon.</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default SecurityPage;